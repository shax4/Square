package org.shax3.square.domain.proposal.service;

import org.junit.jupiter.api.*;
import org.mockito.*;
import org.shax3.square.domain.proposal.dto.request.CreatePropsalRequest;
import org.shax3.square.domain.proposal.dto.response.ProposalResponse;
import org.shax3.square.domain.proposal.model.Proposal;
import org.shax3.square.domain.proposal.repository.ProposalRepository;
import org.shax3.square.domain.user.model.User;
import org.springframework.test.util.ReflectionTestUtils;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

class ProposalServiceTest {

    @Mock
    private ProposalRepository proposalRepository;

    @InjectMocks
    private ProposalService proposalService;

    private Proposal mockProposal;
    private User mockUser;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        mockUser = User.builder()
                .nickname("TestUser")
                .build();

        mockProposal = Proposal.builder()
                .topic("Sample Proposal")
                .build();

        ReflectionTestUtils.setField(mockProposal, "id", 1L);
    }

    @Test
    void save_ShouldSaveProposal() {
        CreatePropsalRequest request = new CreatePropsalRequest("Sample Proposal");

        when(proposalRepository.save(any(Proposal.class))).thenAnswer(invocation -> {
            Proposal savedProposal = invocation.getArgument(0);
            ReflectionTestUtils.setField(savedProposal, "id", 1L);
            return savedProposal;
        });

        ProposalResponse response = proposalService.save(request, "dummy-token");

        assertThat(response).isNotNull();
        assertThat(response.getProposalId()).isEqualTo(mockProposal.getId());

        verify(proposalRepository, times(1)).save(any(Proposal.class));
    }


}